import LanguageDropdown from '@/components/LanguageDropdown';
import { LOGIN_PROMPT, SYSTEM_INITIALIZED } from '@/interfaces/config';
import type { LoginParams, UserInfo } from '@/interfaces/user';
import { login } from '@/services';
import store from '@/store';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { history, useAuth, useNavigate } from 'ice';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loginPrompt, setLoginPrompt] = useState<string>();
  const [, userDispatcher] = store.useModel('user');
  const [configModel] = store.useModel('config');
  const [, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    if (!properties[SYSTEM_INITIALIZED]) {
      navigate('/init', { replace: true });
      return;
    }
    setLoginPrompt(properties[LOGIN_PROMPT]);
  }, [configModel]);

  async function updateUserInfo(user: UserInfo) {
    userDispatcher.updateCurrentUser(user);
  }

  async function handleSubmit(values: LoginParams) {
    try {
      const user = await login(values);
      user.type = 'admin';
      message.success(t('login.loginSuccess'));
      setAuth({
        admin: user.type === 'admin',
        user: user.type === 'user',
      });
      await updateUserInfo(user);
      const urlParams = new URL(window.location.href).searchParams;
      let redirectUrl = urlParams.get('redirect');
      if (!redirectUrl || redirectUrl === '/login') {
        redirectUrl = '/';
      }
      history?.push(redirectUrl);
      return;
    } catch (error) {
      message.error(t('login.loginFailed'));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles['language-dropdown']}>
        <LanguageDropdown />
      </div>
      <div className={styles['login-center']}>
        <div className={styles['login-logo']}>
          <img alt="新一代AI融合安全网关" src="/loginLogo.png" />
          <div className={styles['login-title']}>新一代AI融合安全网关</div>
        </div>
        <div className={styles['login-card']}>
          <Form
            form={form}
            layout="vertical"
            className={styles['login-form']}
            onFinish={handleSubmit}
          >
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('login.usernameRequired') }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('login.usernamePlaceholder')}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('login.passwordPlaceholder')}
              size="large"
            />
          </Form.Item>
          {loginPrompt && (
            <div className={styles['login-prompt']}>
              {loginPrompt}
            </div>
          )}
          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              className={styles['login-btn']}
            >
              {t('login.buttonText')}
            </Button>
          </Form.Item>
        </Form>
      </div>
      </div>
      <div className={styles['login-footer']}>
        © 2024-2026 WntASG. All Rights Reserved.
      </div>
    </div>
  );
};

export default Login;
