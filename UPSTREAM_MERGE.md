# 上游合并纪律（merge-only）

> 本仓库是 higress-console 的 fork（AISecGw Console）。自 s3a-console-ext 解耦闭环（2026-08-24）起，
> 对上游文件的定制修改已收敛至最小集。任何上游同步必须遵循本文档的 merge-only 流程。

## 1. 上游参照体系

| 参照 | 来源 | 用途 |
| --- | --- | --- |
| `upstream/main` | higress-group/higress-console（GitHub） | 官方上游 |
| `mirror/main` | /home/wnt/higress-console（本地 mirror remote） | 镜像跟踪 |
| `mirror/upstream-snapshot-20260819` | 2026-08-19 快照分支 | 定制面 diff 基准 |
| `backup-pre-upstream-sync-20260819` | 本地备份分支 | 同步前安全备份 |

## 2. 解耦架构（现状）

- 自研后端代码：独立仓库 `/home/wnt/ASG/asg-console-extension`
  （Maven 坐标 `com.asg:asg-console-extension:0.0.1-SNAPSHOT`，Spring Boot AutoConfiguration 装配）。
  **唯一集成点**：`backend/console/pom.xml` 中的一行依赖声明。
- 自研 Wasm 插件：独立仓库 `/home/wnt/ASG/asg-wasm-plugins`。
- 运行时配置（datasource/JPA/collector-token）：由 helm chart `asg.*` env + Secret 注入
  （s3b-rest 步骤 1，`application.properties` 已恢复上游）。

## 3. 剩余定制面清单（全部有归属）

| # | 定制面 | 文件 | 归属/处置 |
| --- | --- | --- | --- |
| 1 | NPE 防御 1 行 | `backend/sdk/src/main/java/com/alibaba/higress/sdk/service/WasmPluginServiceImpl.java` | 保留登记；可选提上游 PR 后自然归零 |
| 2-10 | 插件目录资源（9 文件） | `backend/console/src/main/resources/plugins/plugins.properties`（+3 行）、`plugins/ai-pii-guard/`（README/README_EN/spec.yaml）、`plugins/ai-prompt-guard/`（README/README_EN/spec.yaml）、`plugins/shadow-ai-detect/spec.yaml`、`plugins/key-auth/spec.yaml`（identify_only 描述） | **不可外置**（classloader `getResourceAsStream` 单资源限制）；数据级定制，merge-only 覆盖 |
| 11 | 镜像源 1 行 | `backend/Dockerfile`（daocloud mirror FROM + 注释） | 国内拉取必需，保留登记 |
| 12 | 集成点 + 构建参数 | `backend/console/pom.xml`（asg-console-extension 依赖 1 块；node 22.22.2 / app.build.* / skip.frontend / caniuse 与 git 参数） | 集成点为解耦架构本身；构建参数为功能性（近期构建证明必需），保留登记 |
| 13 | .gitignore +1 行 | 根级 `.gitignore`（`frontend/i18n-check-results/`） | fork 工作目录忽略，保留登记 |
| 14 | 版本号去 v 前缀（1 行） | `frontend/src/components/Footer/index.tsx` | 产品展示要求（s3e），保留登记 |
| 15 | 401 修复 + 弹窗去重 | `frontend/src/services/request.tsx` | 上游 bug 修复（上游修复后回退），保留登记 |
| 16 | 开发代理 1 行 | `frontend/ice.config.mts` | 仅开发模式（ICE_CORE_MODE=development），保留登记 |

已归零项：`application.properties`（s3b-rest 步骤 1）、`BuiltInPluginName`/`KeyAuthConfig`/`KubernetesClientService`/`backend/sdk/pom.xml`（s3a-console-ext）、`backend/console/src/main/resources/landing/index.html`（s3e 恢复上游，品牌经 brand.patch 重放）。
非上游侵入（上游本无此文件，不计入定制面）：根级 `Dockerfile`/`.dockerignore`/`build-and-deploy.sh` —— fork 部署工具，归属 asg-deploy 条目。
前端自研页面（~38K 行，9 目录）归属 asg-console-extension 前端注入（inject.sh），不在本清单范围。

> 核验基准（2026-08-26）：`git diff --stat upstream/main...HEAD` = **18 files changed**，与上表（16 项）+ 非侵入 2 文件一致。

## 4. 上游合并流程（merge-only）

1. 备份：`git branch backup-pre-merge-<date>`
2. `git fetch upstream`
3. `git merge upstream/main`（或目标 tag）
4. 冲突处置：严格按第 3 节清单保留定制面；**禁止借冲突解决之机引入新的上游侵入**
5. 合并后验证（必须全绿才可提交）：
   - 扩展模块：`mvn test`（含 `UpstreamApiClientAccessor` 反射兼容性单测）
   - 全量编译：JDK11 + `-Dpmd.skip=true -Dcheckstyle.skip=true -Dgpg.sign.skip=true -Dmaven.javadoc.skip=true`
   - 镜像构建：`docker build --build-arg TARGETARCH=amd64 -f backend/Dockerfile ...`（legacy builder 需显式 TARGETARCH）
6. 定制面清单变化（文件数/行数增减）必须更新本文档并登记验收台账

## 5. 红线

- 除第 3 节清单外，**禁止对上游文件做任何修改**
- 新增自研功能一律走 `asg-console-extension`（后端）/ `asg-wasm-plugins`（插件）
- 升级上游前必须核对 `UpstreamApiClientAccessor` 依赖的 `KubernetesClientService.client` 字段是否仍存在
  （反射访问器会在启动时给出明确异常）
