import React from 'react';
import styled from 'styled-components';

// ============================================
// STYLED COMPONENTS
// ===========================================

const InfoButtonContainer = styled.div`
  display: inline-block;
  width: ${props => props.width};
  color: white;
  fill: white;
  margin: 0;
  vertical-align: top;
`;

const Button = styled.div`
  display: inline-flex;
  background-color: #0e0d0d;
  width: 100%;
  height: 28px;
  border-radius: 17px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.25px;
  line-height: 19px;
  align-items: center;
  justify-content: center;
  padding: 1px;
`;

const Tooltip = styled.div`
  position: relative;
  background-color: #0e0d0d;
  width: 200px;
  left: -50px;
  z-index: 20;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.20px;
  line-height: 17px;
  border-radius: 8px;
  text-align: center;
  padding: 10px;
  margin-top: 5px;
`;

const Icon = styled.img`
  margin-right: 5px;
`;

// ============================================
// REACT
// ===========================================

class InfoButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <InfoButtonContainer width={this.props.width}>
        <Button>
          <Icon src={this.props.icon}/>
          {this.props.value}
        </Button>
        <Tooltip>{this.props.text}</Tooltip>
      </InfoButtonContainer>
    )
  }
}

export default InfoButton;
