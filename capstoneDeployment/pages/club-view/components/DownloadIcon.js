const DownloadIcon = ({
                      fill,
                      size,
                      height,
                      width,
                      ...props
                  }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || width || 24} height={size || height || 24}
             viewBox="0 0 24 24" fill="none" stroke={fill} stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round"
             {...props}
        >
            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/>
        </svg>
    );
};

export default function DownloadIconWrapper(props) {
    return <DownloadIcon {...props} />;
}