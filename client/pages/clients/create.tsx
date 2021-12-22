import ClientForm from "../../components/app/ClientForm";
import Layout from "../../components/LandingPageComponents/Layout";
import { FormType } from "../../types/userTypes";

const Create = () => {
  return (
    <Layout>
      <div className="min-h-full " style={{ background: "#F4F4F4" }}>
        <ClientForm formType={FormType.create} />
      </div>
    </Layout>
  );
};

export default Create;
