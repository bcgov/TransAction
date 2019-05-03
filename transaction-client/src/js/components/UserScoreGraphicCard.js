import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Progress, Container, Row } from 'reactstrap';

class UserScoreGraphicCard extends Component {
  scoreCard(barUserScore, barTeamScore, title) {
    console.log(barUserScore);
    return (
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardSubtitle>
          <Container>
            <Row>
              Your Score
              <Progress id="labelCardProgress" className="ml-2 mr-2" striped color="warning" value={100} />
              Team Score
              <Progress id="labelCardProgress" className="ml-2 mr-2" striped color="primary" value={100} />
            </Row>
          </Container>
          With {this.props.userScore} Points
          <ul />
        </CardSubtitle>
        Contribution %
        <Progress multi>
          <Progress bar animated value={barUserScore} color="warning">
            {barUserScore}%
          </Progress>
          <Progress bar animated value={barTeamScore} color="primary" />
        </Progress>
      </CardBody>
    );
  }

  decideRender(barUserScore, barTeamScore) {
    var title = '';
    if (this.props.type === 'profile') {
      title = this.props.name;
    } else {
      title = "Lets See How You're Doing!";
    }
    console.log(barTeamScore, barUserScore);
    if (isNaN(barTeamScore) && isNaN(barUserScore)) {
      barUserScore = 0;
      barTeamScore = 0;
      return this.scoreCard(barUserScore, barTeamScore, title);
    } else {
      return this.scoreCard(barUserScore, barTeamScore, title);
    }
  }
  render() {
    // console.log('HERE');
    const barUserScore = (this.props.userScore / this.props.teamScore) * 100;
    const barTeamScore = 100 - barUserScore;
    // console.log(barUserScore, barTeamScore);
    return (
      <Container>
        <Card>{this.decideRender(barUserScore, barTeamScore)}</Card>
      </Container>
    );
  }
}

export default UserScoreGraphicCard;
