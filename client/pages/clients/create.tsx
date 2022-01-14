import ClientForm from "../../components/app/ClientForm";
import AppLayout from "../../components/app/Layout";
import { FormType } from "../../types/userTypes";

const Create = () => {
  return (
    <AppLayout>
      <ClientForm formType={FormType.create} />
    </AppLayout>
  );
};

export default Create;
