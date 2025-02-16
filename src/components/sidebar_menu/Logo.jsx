const Logo = ({ collapsed }) => {
  return (
      <div className='logo'>
          <div className="logo-icon">
              <img src="./src/assets/timefit.svg" alt="Logo" />
              {!collapsed && (
                  <div className="logo-text">
                      <span>Time Fit / Admin</span>
                  </div>
              )}
          </div>
      </div>
  )
}
export default Logo