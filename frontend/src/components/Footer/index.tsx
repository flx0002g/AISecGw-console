import store from '@/store';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [systemState] = store.useModel('system');

  return (
    <div style={{ textAlign: 'center', margin: 10 }}>
      &copy; {currentYear}{' '}
      <a href="https://wntasg.io/" target="_blank" rel="noopener noreferrer">WntASG</a>
      {' | '}
      <a href="https://github.com/flx0002g/AISecGw" target="_blank" rel="noopener noreferrer">GitHub</a>
      {
        systemState.version && (
          <>
            <br />
            v{systemState.version}
          </>
        )
      }
    </div>
  );
};

export default Footer;
