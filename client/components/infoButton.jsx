import React from 'react';
import styled from 'styled-components';

// ============================================
// STYLED COMPONENTS
// ===========================================

const InfoButtonContainer = styled.div`
  display: inline-block;
  width: ${props => props.width};
  margin: 0 5px;
  vertical-align: top;
`;

const Button = styled.div`
  display: inline-flex;
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
  background-color: #0e0d0d;
  color: white;
  fill: white;

  :hover {
    background-color: white;
    color: #0e0d0d;
  }
`;

const Tooltip = styled.div`
  position: relative;
  background-color: #0e0d0d;
  width: 200px;
  left: -55px;
  z-index: 10;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.20px;
  line-height: 17px;
  border-radius: 8px;
  text-align: center;
  padding: 10px;
  margin-top: 5px;
  color: white;
`;

const Info = styled.span`
  margin-left: 5px;
`;

// ============================================
// REACT
// ===========================================

class InfoButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    }
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseOver() {
    this.setState({hover:true});
  }

  handleMouseLeave() {
    this.setState({hover:false});
  }

  render() {
    // Render the correct icon based on prop
    var icon = <AnalystBuyIcon fill={this.state.hover ? '#0e0d0d' : 'white'} />
    if (this.props.infoType === 'platformOwners') {
      icon = <PlatformOwnersIcon fill={this.state.hover ? '#0e0d0d' : 'white'} />
    }

    // Show tooltip only on mouseover
    var tooltip = <span></span>
    if (this.state.hover) {
      tooltip = <span><Tooltip className="infoButtonTooltip">{this.props.text}</Tooltip></span>
    }

    return (
      <InfoButtonContainer 
        className="infoButtonContainer" 
        width={this.props.width} 
        onMouseOver={this.handleMouseOver} 
        onMouseLeave={this.handleMouseLeave}>
        <Button>
          {icon}
          <Info className="infoButtonValue">{this.props.value}</Info>
        </Button>
        {tooltip}
      </InfoButtonContainer>
    )
  }
}

export default InfoButton;

// ============================================
// SVGs
// ===========================================

var AnalystBuyIcon = ({fill}) => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20"><g fillRule="evenodd" transform="translate(-4 -4)"><path d="M20.99975,8 C20.44775,8 19.99975,7.552 19.99975,7 C19.99975,6.448 20.44775,6 20.99975,6 C21.55175,6 21.99975,6.448 21.99975,7 C21.99975,7.552 21.55175,8 20.99975,8 M21.99975,4 L14.82775,4 C14.29775,4 13.78875,4.21 13.41375,4.585 L4.58575,13.414 C3.80475,14.195 3.80475,15.461 4.58575,16.242 L11.75675,23.414 C12.53775,24.195 13.80475,24.195 14.58575,23.414 L23.41375,14.586 C23.78875,14.211 23.99975,13.702 23.99975,13.172 L23.99975,6 C23.99975,4.896 23.10375,4 21.99975,4" fill={fill}/></g></svg>);

var PlatformOwnersIcon = ({fill}) => (<svg xmlns="http://www.w3.org/2000/svg" width="11" height="13" viewBox="0 0 11 13"><g fillRule="evenodd"><ellipse cx="6" cy="3.5" rx="3.333" ry="3.5" fill={fill}></ellipse><path d="M4.224,8.4 L7.776,8.4 L7.776,8.4 C10.1088508,8.4 12,10.2911492 12,12.624 L12,14 L0,14 L0,12.624 L8.8817842e-16,12.624 C6.02486595e-16,10.2911492 1.89114922,8.4 4.224,8.4 Z" fill={fill}></path></g></svg>)
