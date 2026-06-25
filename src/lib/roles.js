export function getHomePath(role) {
  switch (role) {
    case 'Watchman':
      return '/visitors/watchman';
    case 'Resident':
      return '/resident';
    default:
      return '/dashboard';
  }
}
