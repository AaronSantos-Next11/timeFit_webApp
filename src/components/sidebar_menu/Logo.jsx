import timefitLogo from '../../assets/timefit.svg';

const Logo = ({ collapsed }) => {
  return (
      <div className='logo'>
          <div className="logo-icon">
              <img src={timefitLogo} alt="Logo" />
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