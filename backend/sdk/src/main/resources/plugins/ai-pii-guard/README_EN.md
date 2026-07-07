---
title: AI PII Guard
keywords: [higress, AI, PII, privacy, masking]
description: LLM PII masking
---

## Introduction
Automatically detect and mask Personally Identifiable Information (PII) in LLM request and response content using configurable regex rules. This includes email addresses, phone numbers, ID card numbers, credit card numbers, social security numbers, IP addresses, and more, preventing sensitive information leakage.

## Runtime Properties

Plugin Phase: `CUSTOM`
Plugin Priority: `300`

## Configuration
| Name | Type | Requirement | Default | Description |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| `protect_request` | bool | optional | true | Whether to mask PII in request content |
| `protect_response` | bool | optional | false | Whether to mask PII in response content |
| `log_matches` | bool | optional | true | Whether to log PII match information (without actual values) |
| `rules` | array | optional | Built-in default rules | Custom PII detection rules list. Built-in default rules are used when empty |

### rules Item Configuration
| Name | Type | Requirement | Default | Description |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| `name` | string | required | - | Rule name for logging |
| `pattern` | string | required | - | Regex pattern to match PII |
| `replacement` | string | optional | `[REDACTED]` | Replacement text for matched PII, supports $1, $2 capture groups |

### Built-in Default Rules
When `rules` is not configured, the plugin uses the following built-in default rules:

| Rule Name | Description | Replacement |
| ------------ | ------------ | ------------ | ------------ |
| `email` | Email address | `[EMAIL_REDACTED]` |
| `phone_cn` | China mainland phone number | `[PHONE_REDACTED]` |
| `phone_intl` | International phone number | `[PHONE_REDACTED]` |
| `id_card_cn` | China mainland ID card number | `[ID_REDACTED]` |
| `credit_card` | Credit card number | `[CARD_REDACTED]` |
| `ssn_us` | US Social Security Number | `[SSN_REDACTED]` |
| `ipv4` | IPv4 address | `[IP_REDACTED]` |

## Examples of Configuration
### Mask request content only (using default rules)

```yaml
protect_request: true
protect_response: false
```

### Mask both request and response content

```yaml
protect_request: true
protect_response: true
```

### Use custom rules

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

## Request Example
```bash
curl http://localhost/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "My email is test@example.com, phone is 13800138000"
    }
  ]
}'
```

When request masking is enabled, the email and phone number in the request content will be automatically replaced:

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "My email is [EMAIL_REDACTED], phone is [PHONE_REDACTED]"
    }
  ]
}
```
