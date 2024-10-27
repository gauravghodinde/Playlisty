
const FallbackAvatar = ({ username }) => {
    // Generate a consistent color based on username
    const stringToColor = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
      return '#' + '00000'.substring(0, 6 - c.length) + c;
    };
  
    const backgroundColor = stringToColor(username);
    const initials = username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  
    return (
      <div 
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"
        style={{ 
          background: `linear-gradient(135deg, ${backgroundColor}40, ${backgroundColor}80)`
        }}
      >
      </div>
    );
  };

  export default FallbackAvatar;