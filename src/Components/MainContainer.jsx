import PropTypes from "prop-types";

MainContainer.propTypes = {
  children: PropTypes.array,
};

function MainContainer({ children }) {
  return <main className="main">{children}</main>;
}

export default MainContainer;
