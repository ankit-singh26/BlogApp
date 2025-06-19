const Layout = ({ children }) => {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      {children}
    </div>
  );
};

export default Layout;
