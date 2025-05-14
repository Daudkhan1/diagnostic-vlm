import "./heading.scss";

const Heading = (props) => {
  const { heading, description } = props;

  return (
    <section className="main-heading-container">
      <h1 className="heading">{heading}</h1>

      <p className="description">{description}</p>
    </section>
  );
};

export default Heading;
