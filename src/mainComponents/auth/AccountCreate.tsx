import CustomDialog from "@/src/components/common/customDialog/CustomDialog";

interface AccountCreateProps {
  open: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}
const AccountCreate = ({ open, onClose, onOpenLogin }: AccountCreateProps) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Account Created Successfully!"
      description="Please check your email to confirm your account"
    >
      <div className="space-y-3 text-lightWhite">
        <p>
          For security reasons, you must confirm your new password before you
          can log in. An email has been sent to you with instructions on how to
          do this. Once you confirm, you can log in by clicking the Log In
          button in the bar above the map.
        </p>
        <p>
          <b>NOTE:</b> If you do not receive the confirmation email, check your
          Junk or Spam folder. If you still can't find the email, send us an
          email at &nbsp;
          <a
            href="mailto:support@bcclub.ca"
            className="text-primary font-medium"
          >
            support@bcclub.ca
          </a>{" "}
          and we will activate your account.
        </p>
        <p className="text-center mt-3">
          Ready to sign in?&nbsp;
          <span
            onClick={onOpenLogin}
            className="hover:underline text-primary cursor-pointer"
          >
            Sign in here
          </span>
        </p>
      </div>
    </CustomDialog>
  );
};

export default AccountCreate;
