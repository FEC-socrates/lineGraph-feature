# WARNING: This file contains a private API token and should in .gitignore

curl --user 5d44668f2f1188ee0fcb546bbadc47db307ab4c8: \
  --request POST \
  --form revision=4f8375454058300860a21884439738f8212be428 \
  --form config=@config.yml \
  --form notify=false \
    https://circleci.com/api/v1.1/project/github/FEC-socrates/lineGraph-feature/tree/feat%2Fchange-chart1y
