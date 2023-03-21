const NoteIcon = ({
                    fill,
                    size,
                    height,
                    width,
                    ...props
                  }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         width={size || width || 24} height={size || height || 24}
         viewBox="0 0 24 24" fill="none"
         stroke={fill} strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
      <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
    </svg>
  );
};

export default function NoteIconWrapper(props) {
  return <NoteIcon {...props} />;
}