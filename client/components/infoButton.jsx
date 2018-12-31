import React from 'react';
import styled from 'styled-components';

// ============================================
// STYLED COMPONENTS
// ===========================================

const InfoButtonContainer = styled.div`
  display: inline-block;
  width: 100px;
  color: white;
  margin: 0;
`;

const Button = styled.div`
  display: inline-flex;
  background-color: grey;
  width: 100%;
  height: 28px;
  border-radius: 17px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.25px;
  line-height: 19px;
`;

const Tooltip = styled.div`
  position: relative;
  background-color: grey;
  width: 200px;
  left: -50px;
  z-index: 20;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.20px;
  line-height: 17px;
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
      <InfoButtonContainer>
        <Button>
          <img src='./person.svg'/>
          Test
        </Button>
        <Tooltip>This is a very long tooltip with text that will span multiple lines</Tooltip>
      </InfoButtonContainer>
    )
  }
}

export default InfoButton;
