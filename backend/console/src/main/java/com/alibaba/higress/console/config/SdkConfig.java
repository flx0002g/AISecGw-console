/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.console.config;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.service.impl.AgentAuditPersistenceService;
import com.alibaba.higress.sdk.config.HigressServiceConfig;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.model.wasmplugin.WasmPluginServiceConfig;
import com.alibaba.higress.sdk.service.AgentGuardService;
import com.alibaba.higress.sdk.service.AuditChainService;
import com.alibaba.higress.sdk.service.AuditChainServiceImpl;
import com.alibaba.higress.sdk.service.AuditLogCollectorService;
import com.alibaba.higress.sdk.service.BehaviorAnalysisService;
import com.alibaba.higress.sdk.service.DomainService;
import com.alibaba.higress.sdk.service.HigressServiceProvider;
import com.alibaba.higress.sdk.service.ProxyServerService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.ServiceService;
import com.alibaba.higress.sdk.service.ServiceSourceService;
import com.alibaba.higress.sdk.service.AgentGuardService;
import com.alibaba.higress.sdk.service.ShadowAiService;
import com.alibaba.higress.sdk.service.TlsCertificateService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.WasmPluginService;
import com.alibaba.higress.sdk.service.ai.AiRouteService;
import com.alibaba.higress.sdk.service.ai.LlmProviderService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.service.mcp.McpServerService;
import com.alibaba.higress.sdk.service.RedisAuditSyncService;

@Configuration
@EnableScheduling
public class SdkConfig {

    @Value("${" + SystemConfigKey.KUBE_CONFIG_KEY + ":}")
    private String kubeConfig;

    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_NAME_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT
        + "}")
    private String controllerServiceName = HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.NS_KEY + ":" + HigressConstants.NS_DEFAULT + "}")
    private String controllerNamespace = HigressConstants.NS_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_WATCHED_NAMESPACE_KEY + ":}")
    private String controllerWatchedNamespace;

    @Value("${" + SystemConfigKey.CONTROLLER_INGRESS_CLASS_NAME_KEY + ":}")
    private String controllerWatchedIngressClassName;

    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_HOST_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT
        + "}")
    private String controllerServiceHost = HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_PORT_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT
        + "}")
    private int controllerServicePort = HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_JWT_POLICY_KEY + ":" + HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT
        + "}")
    private String controllerJwtPolicy = HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_ACCESS_TOKEN_KEY + ":}")
    private String controllerAccessToken;

    @Value("${" + SystemConfigKey.CLUSTER_DOMAIN_SUFFIX + ":" + HigressConstants.CLUSTER_DOMAIN_SUFFIX_DEFAULT + "}")
    private String clusterDomainSuffix;

    private HigressServiceProvider serviceProvider;

    @PostConstruct
    public void initialize() throws IOException {
        HigressServiceConfig config = HigressServiceConfig.builder().withKubeConfigPath(kubeConfig)
            .withControllerNamespace(controllerNamespace).withControllerWatchedNamespace(controllerWatchedNamespace)
            .withControllerWatchedIngressClassName(controllerWatchedIngressClassName)
            .withControllerServiceName(controllerServiceName).withControllerServiceHost(controllerServiceHost)
            .withControllerServicePort(controllerServicePort).withControllerJwtPolicy(controllerJwtPolicy)
            .withControllerAccessToken(controllerAccessToken).withClusterDomainSuffix(clusterDomainSuffix)
            .withWasmPluginServiceConfig(WasmPluginServiceConfig.buildFromEnv()).build();
        serviceProvider = HigressServiceProvider.create(config);
    }

    @Bean
    public KubernetesClientService kubernetesClientService() {
        return serviceProvider.kubernetesClientService();
    }

    @Bean
    public KubernetesModelConverter kubernetesModelConverter() {
        return serviceProvider.kubernetesModelConverter();
    }

    @Bean
    public DomainService domainService() {
        return serviceProvider.domainService();
    }

    @Bean
    public RouteService routeService() {
        return serviceProvider.routeService();
    }

    @Bean
    public ServiceService serviceService() {
        return serviceProvider.serviceService();
    }

    @Bean
    public ServiceSourceService serviceSourceService() {
        return serviceProvider.serviceSourceService();
    }

    @Bean
    public ProxyServerService proxyServerService() {
        return serviceProvider.proxyServerService();
    }

    @Bean
    public TlsCertificateService tlsCertificateService() {
        return serviceProvider.tlsCertificateService();
    }

    @Bean
    public WasmPluginService wasmPluginService() {
        return serviceProvider.wasmPluginService();
    }

    @Bean
    public WasmPluginInstanceService wasmPluginInstanceService() {
        return serviceProvider.wasmPluginInstanceService();
    }

    @Bean
    public ConsumerService consumerService() {
        return serviceProvider.consumerService();
    }

    @Bean
    public AiRouteService aiRouteService() {
        return serviceProvider.aiRouteService();
    }

    @Bean
    public LlmProviderService llmProviderService() {
        return serviceProvider.llmProviderService();
    }

    @Bean
    public McpServerService mcpServerService() {
        return serviceProvider.mcpServerService();
    }

    @Bean
    public McpServerHelper mcpServerHelper() {
        return new McpServerHelper();
    }

    @Bean
    public ShadowAiService shadowAiService() {
        return serviceProvider.shadowAiService();
    }

    @Bean
    public AgentGuardService agentGuardService() {
        return serviceProvider.agentGuardService();
    }

    @Bean
    public AuditChainService auditChainService(AgentAuditPersistenceService auditSink) {
        AuditChainService service = serviceProvider.auditChainService();
        if (service instanceof AuditChainServiceImpl) {
            ((AuditChainServiceImpl) service).setAuditLogSink(auditSink);
        }
        return service;
    }

    @Bean
    public BehaviorAnalysisService behaviorAnalysisService() {
        return serviceProvider.behaviorAnalysisService();
    }

    @Bean
    public AuditLogCollectorService auditLogCollectorService() {
        return serviceProvider.auditLogCollectorService();
    }

    /**
     * Incremental Redis → MySQL audit sync (IR-015): covers entries written
     * directly by Wasm plugins which bypass the stdout collector path.
     * Self-schedules on a daemon thread; no periodic hook needed here.
     */
    @Bean
    public RedisAuditSyncService redisAuditSyncService(AgentAuditPersistenceService auditSink) {
        return new RedisAuditSyncService(null, 0, auditSink);
    }
    /**
     * Cleanup task thread pool config for @Scheduled audit cleanup.
     */
    @Bean
    public ThreadPoolTaskScheduler auditCleanupTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1);
        scheduler.setThreadNamePrefix("audit-cleanup-sched-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(30);
        return scheduler;
    }

    /**
     * Run expired audit log cleanup every hour.
     */
    @Scheduled(fixedRate = 3600000)
    public void scheduledAuditCleanup() {
        if (serviceProvider != null) {
            serviceProvider.auditChainService().cleanupExpiredLogs();
        }
    }

    /**
     * 行为分析任务线程池（方案 5.7）。
     * 画像构建、基线重算、风险检测共享线程池，poolSize=2 避免任务间相互阻塞。
     */
    @Bean
    public ThreadPoolTaskScheduler behaviorAnalysisTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("behavior-analysis-sched-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(60);
        return scheduler;
    }

    /**
     * 行为画像增量构建，每 60 秒触发一次（方案 5.7）。
     */
    @Scheduled(fixedRate = 60000)
    public void scheduledProfileUpdate() {
        if (serviceProvider != null) {
            try {
                serviceProvider.behaviorAnalysisService().rebuildProfiles();
            } catch (Exception e) {
                // 静默吞掉异常，避免调度器因异常终止后续执行
            }
        }
    }

    /**
     * 行为基线 EMA 重算，每 1 小时触发一次（方案 5.7）。
     */
    @Scheduled(fixedRate = 3600000)
    public void scheduledBaselineRebuild() {
        if (serviceProvider != null) {
            try {
                serviceProvider.behaviorAnalysisService().rebuildBaselines();
            } catch (Exception e) {
                // 静默吞掉异常，避免调度器因异常终止后续执行
            }
        }
    }

    /**
     * 行为风险检测，每 5 秒触发一次（演示场景加速，生产可调回 60s）。
     * Phase 3 实现 runRiskDetection 的 6 类规则。
     */
    @Scheduled(fixedRate = 5000)
    public void scheduledRiskDetection() {
        if (serviceProvider != null) {
            try {
                serviceProvider.behaviorAnalysisService().runRiskDetection();
            } catch (Exception e) {
                // 静默吞掉异常，避免调度器因异常终止后续执行
            }
        }
    }

    /**
     * 误报复盘任务，每日 03:00 触发一次（方案 9.2 / 阶段五 任务 3）。
     * 聚合 24h 内 false_positive 率，>30% 自动上调阈值，>50% 暂停自动阻断 + 临时白名单。
     * 使用 cron 表达式避开高峰期，凌晨执行减少对实时检测的影响。
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void scheduledRuleFeedback() {
        if (serviceProvider != null) {
            try {
                serviceProvider.behaviorAnalysisService().runRuleFeedback();
            } catch (Exception e) {
                // 静默吞掉异常，避免调度器因异常终止后续执行
            }
        }
    }

    /**
     * 审计日志采集任务，每 30 秒从 gateway pod stdout 读取 ai_log，
     * 解析 agent_guard_audit 字段并写入 Redis 审计链。
     * 用于 Wasm 运行时不支持 Redis host function 时的兜底采集方案。
     * sinceSeconds=90 覆盖约 3 个采集周期，保证不遗漏。
     */
    @Scheduled(fixedRate = 30000, initialDelay = 15000)
    public void scheduledAuditLogCollection() {
        if (serviceProvider != null) {
            try {
                serviceProvider.auditLogCollectorService().collect(90);
            } catch (Exception e) {
                // 静默吞掉异常，避免调度器因异常终止后续执行
            }
        }
    }
}
