import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import * as config from "../../src/config";

function Cards(props) {
  // tell sentences from global redux state
  const tellSentences = useSelector((state) => state.tellsentences);
  // const approvedSentences = useSelector((state) => state.approvedsentences);

  // track if images are done loading
  const [loading, isLoading] = useState(true);

  // Card component for displaying sample students' approved sentences
  return (
    <Grid
      padding={"1% 0"}
      container
      rowSpacing={{ xs: 1, sm: 2, md: 4 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {props.displaySentences
        ?.slice(0, config.DisplayCollectionSentences)
        .map((sentence, index) => {
          const day = +sentence.title.match(/\d+$/);
          return (
            <Grid
              xs={4}
              sm={4}
              md={4}
              key={index}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Card
                sx={{
                  maxWidth: 500,
                  boxShadow: "1.5px 1.5px rgba(0, 0, 255, .2)",
                  margin: "0% 2%",
                }}
              >
                {loading && (
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width={500}
                    height={250}
                    hidden={!loading}
                  />
                )}
                <CardMedia
                  component="img"
                  sx={{ height: 250 }}
                  image={tellSentences[day - 1].image}
                  title={sentence.tell}
                  onLoad={() => setTimeout(() => isLoading(false), 200)}
                  hidden={loading}
                />

                <CardContent>
                  <Typography gutterBottom variant="body1" component="div">
                    {sentence.show}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {sentence.tell}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"right"}
                  >
                    {sentence.author.firstName +
                      " " +
                      sentence.author.lastName.slice(0, 1) +
                      "."}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button hidden={true} size="small">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
}

export default Cards;
