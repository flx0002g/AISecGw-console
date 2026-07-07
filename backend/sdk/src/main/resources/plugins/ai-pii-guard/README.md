---
title: AI 个人信息脱敏
keywords: [higress, AI, PII, privacy, masking]
description: 大模型个人信息脱敏
---

## 功能说明
基于可配置的正则规则，自动检测并脱敏大模型请求和响应中的个人隐私信息（PII），包括邮箱、手机号、身份证号、信用卡号、社保号、IP地址等，防止敏感信息泄露。

## 运行属性

插件执行阶段：`默认阶段`
插件执行优先级：`300`

## 配置说明
| Name | Type | Requirement | Default | Description |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| `protect_request` | bool | optional | true | 是否对请求中的个人隐私信息进行脱敏处理 |
| `protect_response` | bool | optional | false | 是否对响应中的个人隐私信息进行脱敏处理 |
| `log_matches` | bool | optional | true | 是否在日志中记录PII匹配信息（不记录实际值） |
| `rules` | array | optional | 内置默认规则 | 自定义PII检测规则列表，为空时使用内置默认规则 |

### rules 子项配置
| Name | Type | Requirement | Default | Description |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| `name` | string | required | - | 规则名称，用于日志记录 |
| `pattern` | string | required | - | 用于匹配PII的正则表达式 |
| `replacement` | string | optional | `[REDACTED]` | 匹配到的PII的替换文本，支持$1、$2等捕获组 |

### 内置默认规则
当未配置 `rules` 时，插件使用以下内置默认规则：

| 规则名称 | 说明 | 替换文本 |
| ------------ | ------------ | ------------ | ------------ |
| `email` | 邮箱地址 | `[EMAIL_REDACTED]` |
| `phone_cn` | 中国大陆手机号 | `[PHONE_REDACTED]` |
| `phone_intl` | 国际手机号 | `[PHONE_REDACTED]` |
| `id_card_cn` | 中国大陆身份证号 | `[ID_REDACTED]` |
| `credit_card` | 信用卡号 | `[CARD_REDACTED]` |
| `ssn_us` | 美国社保号 | `[SSN_REDACTED]` |
| `ipv4` | IPv4地址 | `[IP_REDACTED]` |

## 配置示例
### 仅脱敏请求内容（使用默认规则）

```yaml
protect_request: true
protect_response: false
```

### 同时脱敏请求和响应内容

```yaml
protect_request: true
protect_response: true
```

### 使用自定义规则

```yaml
protect_request: true
protect_response: false
log_matches: true
rules:
  - name: email
    pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"
    replacement: "[EMAIL_REDACTED]"
  - name: phone_cn
    pattern: "\\b1[3-9]\\d{9}\\b"
    replacement: "[PHONE_REDACTED]"
  - name: id_card_cn
    pattern: "\\b\\d{17}[\\dXx]\\b"
    replacement: "[ID_REDACTED]"
```

## 请求示例
```bash
curl http://localhost/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "我的邮箱是test@example.com，手机号是13800138000"
    }
  ]
}'
```

当开启请求脱敏时，请求内容中的邮箱和手机号会被自动替换：

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "我的邮箱是[EMAIL_REDACTED]，手机号是[PHONE_REDACTED]"
    }
  ]
}
```
