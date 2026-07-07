import {
  AuditOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  GlobalOutlined,
  RadarChartOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WindowsOutlined,
} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        name: 'init.title',
        path: '/init',
        hideFromMenu: true,
        usePureLayout: true,
      },
      {
        name: 'login.title',
        path: '/login',
        hideFromMenu: true,
        usePureLayout: true,
      },
      {
        name: '',
        path: '/user',
        hideFromMenu: true,
        children: [
          {
            name: 'user.changePassword.title',
            path: '/user/changePassword',
          },
        ],
      },
      {
        name: 'menu.dashboard',
        path: '/dashboard',
        icon: <DashboardOutlined />,
      },
      {
        name: 'menu.aiServiceManagement',
        icon: <RobotOutlined />,
        children: [
          {
            name: 'menu.llmProviderManagement',
            path: '/ai/provider',
          },
          {
            name: 'menu.aiRouteManagement',
            path: '/ai/route',
          },
          {
            name: 'menu.aiDashboard',
            path: '/ai/dashboard',
            visiblePredicate: (configData: any) => configData && configData['dashboard.builtin'],
          },
          {
            name: 'menu.mcpManagement',
            path: '/mcp/list',
            hideChildrenInMenu: true,
            children: [
              {
                name: 'menu.mcpConfigurations',
                path: '/mcp/detail',
              },
            ],
          },
        ],
      },
      {
        name: 'menu.shadowAiManagement',
        icon: <EyeOutlined />,
        children: [
          {
            name: 'menu.shadowAiDetected',
            path: '/shadow-ai/detected',
          },
          {
            name: 'menu.shadowAiRoute',
            path: '/shadow-ai/route',
          },
        ],
      },
      {
        name: 'menu.aiContentSecurity',
        icon: <SecurityScanOutlined />,
        children: [
          {
            name: 'menu.aiSecurityGuard',
            path: '/ai-security-guard',
          },
          {
            name: 'menu.aiPiiGuard',
            path: '/ai-pii-guard',
          },
          {
            name: 'menu.aiPromptGuard',
            path: '/ai-prompt-guard',
          },
          {
            name: 'menu.aiKeywordFilter',
            path: '/ai-keyword-filter',
          },
          {
            name: 'menu.aiWafProtection',
            path: '/ai-waf',
          },
        ],
      },
      {
        name: 'menu.aiAgentGuard',
        icon: <SafetyCertificateOutlined />,
        children: [
          {
            name: 'menu.aiAgentGuardConfig',
            path: '/ai-agent-guard/config',
          },
        ],
      },
      {
        name: 'menu.auditChain',
        icon: <AuditOutlined />,
        children: [
          {
            name: 'menu.auditChainLogs',
            path: '/audit-chain/audit-logs',
          },
          {
            name: 'menu.auditChainTracking',
            path: '/audit-chain/audit-chain',
          },
        ],
      },
      {
        name: 'menu.behaviorAnalysis',
        icon: <RadarChartOutlined />,
        children: [
          {
            name: 'menu.behaviorDashboard',
            path: '/behavior-analysis/dashboard',
          },
          {
            name: 'menu.behaviorAlerts',
            path: '/behavior-analysis/alerts',
          },
          {
            name: 'menu.behaviorProfiles',
            path: '/behavior-analysis/profiles',
          },
          {
            name: 'menu.behaviorSessionGraph',
            path: '/behavior-analysis/session-graph',
          },
        ],
      },
      {
        name: 'menu.serviceSources',
        path: '/service-source',
        icon: <FullscreenExitOutlined />,
      },
      {
        name: 'menu.serviceList',
        path: '/service',
        icon: <UnorderedListOutlined />,
      },
      {
        name: 'menu.routeConfig',
        path: '/route',
        icon: <DeploymentUnitOutlined />,
      },
      {
        name: 'menu.pluginManagement',
        path: '/plugin',
        icon: <WindowsOutlined />,
      },
      {
        name: 'menu.domainManagement',
        path: '/domain',
        icon: <GlobalOutlined />,
      },
      {
        name: 'menu.certManagement',
        path: '/tls-certificate',
        icon: <SafetyCertificateOutlined />,
      },
      {
        name: 'menu.consumerManagement',
        path: '/consumer',
        icon: <UserOutlined />,
      },
      {
        name: 'menu.systemSettings',
        path: '/system',
        icon: <SettingOutlined />,
      },
    ],
  },
};
