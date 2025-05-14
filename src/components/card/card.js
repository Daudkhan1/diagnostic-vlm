import "./card.scss";

const cardData = [
  {
    id: "card-001",
    title: "Upload Scans",
    details:
      "Drag and drop or select your medical scan images for instant analysis.",
  },
  {
    id: "card-002",
    title: "Ask Questions",
    details:
      "Ask specific questions about your scan and receive detailed medical insights.",
  },
  {
    id: "card-003",
    title: "Get Insights",
    details:
      "Receive comprehensive analysis and observations based on advanced AI technology.",
  },
];

const Card = () => {
  return cardData.map((item) => (
    <article key={item.id} className="card-main-container">
      <img className="card-icon" src="/card-logo.png" alt="card displays" />

      <h6 className="card-title">{item.title}</h6>

      <p className="card-details">{item.details}</p>
    </article>
  ));
};

export default Card;
