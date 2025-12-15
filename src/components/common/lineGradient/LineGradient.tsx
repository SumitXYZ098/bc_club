const LineGradient = ({
  customClasses,
  vr,
}: {
  customClasses?: string;
  vr?: boolean;
}) => {
  return vr ? (
    // Vertical line
    <div
      className={`bg-[linear-gradient(to_top,rgba(117,117,117,0)_0%,rgba(117,117,117,1)_50%,rgba(117,117,117,0)_100%)] h-4  w-px ${
        customClasses ? customClasses : "mx-1 h-4"
      }`}
    />
  ) : (
    // Horizontal line
    <div
      className={`bg-[linear-gradient(to_right,rgba(117,117,117,0)_0%,rgba(117,117,117,1)_50%,rgba(117,117,117,0)_100%)] w-full h-px ${
        customClasses ? customClasses : "my-1"
      }`}
    />
  );
};

export default LineGradient;
