import PropTypes from "prop-types";

Footer.propTypes = {
  children: PropTypes.array.isRequired,
};

function Footer({ children }) {
  return <footer>{children}</footer>;
}

export default Footer;
