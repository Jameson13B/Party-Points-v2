export const getInitials = user => {
  if (user.track === 'Teacher') {
    return '👨‍🏫'
  }
  const first = user.name.substring(0, 1)
  let last = user.name
    .split(' ')
    .slice(1, 2)
    .join('')
    .substring(0, 1)
  return first + last
}
