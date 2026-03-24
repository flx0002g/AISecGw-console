import i18n, { lngs } from "@/i18n";
import { GithubOutlined } from "@ant-design/icons";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { t } = useTranslation();

  const linkList = useMemo(() => {
    const lang = i18n.language;
    const langConfig = lngs.find(l => l.code === lang);
    const officialSiteLang = langConfig?.officialSiteCode || lang.toLowerCase();
    return [
      {
        name: t("navbar.officialWebsite"),
        link: `https://wntaigw.io/${officialSiteLang}/`,
      },
      {
        name: t("navbar.docs"),
        link: `https://wntaigw.io/${officialSiteLang}/docs/overview/what-is-wntaigw/`,
      },
      {
        name: t("navbar.commercial"),
        link: `https://www.aliyun.com/product/apigateway?spm=wntaigw-console.topbar.0.0.0`,
      },
      {
        name: t("navbar.developers"),
        link: `https://wntaigw.io/${officialSiteLang}/docs/developers/developers_dev/`,
      },
      {
        name: t("navbar.blog"),
        link: `https://wntaigw.io/${officialSiteLang}/blog/`,
      },
      {
        name: t("navbar.community"),
        link: `https://wntaigw.io/${officialSiteLang}/community/`,
      },
      {
        name: t("navbar.download"),
        link: "https://github.com/alibaba/wntaigw/releases",
      },
    ];
  }, [i18n.language]);
  return (
    <ul className={styles["header-nav-bar"]}>
      {linkList.map((item) => {
        return (
          <li key={item.link}>
            <a href={item.link} target="_blank">
              {item.name}
            </a>
          </li>
        );
      })}
      <li>
        <a href="https://github.com/alibaba/wntaigw" target="_blank">
          <GithubOutlined style={{ fontSize: "16px" }} />
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
