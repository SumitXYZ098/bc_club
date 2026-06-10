const PoweredBy = ({
  className,
  textStyle = "md:text-sm text-xs",
}: {
  className?: string;
  textStyle?: string;
}) => {
  return (
    <div className={`flex items-center gap-1 flex-nowrap ${className}`}>
      <p className={`text-black70 ${textStyle}`}>Source:</p>
      <p className={`text-[#3B4E19] ${textStyle}`}>
        Fraser Valley Real Estate Board
      </p>
    </div>
  );
};

export default PoweredBy;
