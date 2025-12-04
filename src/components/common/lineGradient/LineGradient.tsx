const LineGradient = ({ customClasses }: { customClasses?: string }) => {
  return (
    <div
      className={`bg-[linear-gradient(to_right,rgba(117,117,117,0)_0%,rgba(117,117,117,1)_50%,rgba(117,117,117,0)_100%)] w-full h-px ${
        customClasses ? customClasses : "my-5"
      } `}
    />
  );
};

export default LineGradient;
