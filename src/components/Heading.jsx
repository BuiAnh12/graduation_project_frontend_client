import { Helmet } from "react-helmet-async";

const Heading = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <meta charSet='utf-8' />
      <title>{title}</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <link rel='icon' type='image/png' href='/assets/logo_app.png' />
    </Helmet>
  );
};

export default Heading;
