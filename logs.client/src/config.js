// ==============================|| THEME CONSTANT ||============================== //

export const APP_DEFAULT_PATH = '/dashboard/default';
export const DRAWER_WIDTH = 260;

export let MenuOrientation;

(function (MenuOrientation) {
  MenuOrientation['VERTICAL'] = 'vertical';
})(MenuOrientation || (MenuOrientation = {}));

// ==============================|| THEME CONFIG ||============================== //

const config = {
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  menuOrientation: MenuOrientation.VERTICAL,
  container: false,
  presetColor: 'default',
  caption: true,
  sidebarTheme: false,
  customColor: 'preset-4',
  headerColor: '',
  navbarColor: '',
  logoColor: '',
  navbarCaptionColor: '',
  navbarImg: '',
  menuIcon: 'preset-4',
  menuLinkIcon: 'preset-4'
};

export default config;
