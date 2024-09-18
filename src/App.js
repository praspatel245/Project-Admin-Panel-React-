import React from "react";
import { Layout,Menu } from "antd";
import { Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Dashboard from "./../src/pages/Dashboard";
import Projects from "./../src/pages/Projects";
import './i18n';
import Estimates from "./pages/Estimates";

const { Header, Content, Footer,Sider } = Layout;

const App = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Header style={{color:'white'}}>{t('header.title')}</Header>
      <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/projects">Projects</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/estimates">Estimates</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content>
        <Routes>          
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/estimates" element={<Estimates />} />
        </Routes>
      </Content>
      </Layout>
      <Footer style={{textAlign:"center"}}>{t('footer.text')}</Footer>
    </Layout>
  );
};

export default App;
