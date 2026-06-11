export function getHomePath(role) {
  switch (role) {
    case 'Watchman':
      return '/parking/gate';
    case 'Resident':
      return '/resident';
    default:
      return '/dashboard';
  }
}
