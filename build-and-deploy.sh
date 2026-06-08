#!/usr/bin/env bash
# WntASG Console - Build and Deploy Script
# Usage: ./build-and-deploy.sh [command]
# Commands:
#   build     - Build Docker image (default)
#   deploy    - Build image and deploy to current K8s cluster
#   all       - Build and deploy (same as deploy)
#   clean     - Remove built image

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMAGE_NAME="${IMAGE_NAME:-wntasg-console}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
NAMESPACE="${NAMESPACE:-higress-system}"

build_image() {
    echo "=== Building WntASG Console image: ${FULL_IMAGE} ==="
    docker build -t "${FULL_IMAGE}" "${SCRIPT_DIR}"
    echo "=== Build complete: ${FULL_IMAGE} ==="
    docker images "${FULL_IMAGE}"
}

deploy_to_k8s() {
    build_image

    echo "=== Deploying to K8s cluster (namespace: ${NAMESPACE}) ==="

    # Check if helm release exists
    if ! helm status higress -n "${NAMESPACE}" &>/dev/null; then
        echo "Error: Helm release 'higress' not found in namespace '${NAMESPACE}'"
        echo "Please deploy AISecGw first using the deploy.sh script from the AISecGw repository."
        exit 1
    fi

    # Load image into kind cluster if using kind
    local cluster_name
    cluster_name=$(kubectl config current-context 2>/dev/null | sed 's/kind-//' || echo "")
    if [ -n "${cluster_name}" ] && kind get clusters 2>/dev/null | grep -q "${cluster_name}"; then
        echo "=== Loading image into kind cluster: ${cluster_name} ==="
        kind load docker-image "${FULL_IMAGE}" --name "${cluster_name}"
    fi

    # Update helm release to use custom console image
    echo "=== Updating Helm release with custom console image ==="
    helm upgrade higress "${SCRIPT_DIR}/../AISecGw/helm/higress" \
        -n "${NAMESPACE}" \
        --set higress-console.image.repository="${IMAGE_NAME}" \
        --set higress-console.image.tag="${IMAGE_TAG}" \
        --set higress-console.image.pullPolicy=Never \
        --reuse-values

    # Wait for rollout
    echo "=== Waiting for console pod rollout ==="
    kubectl rollout status deployment/higress-console -n "${NAMESPACE}" --timeout=120s

    echo "=== Deploy complete ==="
    echo "Access console: kubectl port-forward -n ${NAMESPACE} svc/higress-console 8080:8080"
    echo "Then open http://localhost:8080"
}

clean_image() {
    echo "=== Removing image: ${FULL_IMAGE} ==="
    docker rmi "${FULL_IMAGE}" 2>/dev/null || echo "Image not found locally"
}

case "${1:-build}" in
    build)
        build_image
        ;;
    deploy|all)
        deploy_to_k8s
        ;;
    clean)
        clean_image
        ;;
    *)
        echo "Usage: $0 {build|deploy|all|clean}"
        exit 1
        ;;
esac
