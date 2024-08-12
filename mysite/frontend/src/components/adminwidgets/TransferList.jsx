import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

import { API, graphqlOperation } from "aws-amplify";

import { updateMember as updateMembertMutation } from "../../graphql/mutations";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export function TransferList({ leftIn, rightIn }) {
  React.useEffect(() => {
    setLeft(leftIn);
    setRight(rightIn);
  }, [leftIn, rightIn]);

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(leftIn);
  const [right, setRight] = React.useState(rightIn);

  const leftChecked = intersection(
    checked,
    left.map((mem) => mem.id)
  );
  const rightChecked = intersection(
    checked,
    right.map((mem) => mem.id)
  );

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log("newchecked");
    console.log(newChecked);
  };

  const handleCheckedRight = () => {
    for (const added of leftChecked) {
      console.log("input");
      console.log({ paymentHoliday: true, id: added });
      try {
        API.graphql(
          graphqlOperation(updateMembertMutation, {
            input: { paymentHoliday: true, id: added },
          })
        );
      } catch (error) {
        console.error("Error updating payment holiday", error);
      }
    }

    setRight(
      right
        .concat(left.filter((left) => leftChecked.includes(left.id)))
        .sort((a, b) => a.surname?.localeCompare(b.surname))
    );
    setLeft(
      not(
        left,
        left.filter((left) => leftChecked.includes(left.id))
      )
    );
    setChecked(
      not(
        checked,
        left
          .filter((left) => leftChecked.includes(left.id))
          .map((item) => item.id)
      )
    );
  };

  const handleCheckedLeft = () => {
    console.log("clicked");
    console.log("right");
    console.log(right);
    // right is array of objects
    //
    // set payment holiday false
    //
    for (const added of rightChecked) {
      try {
        API.graphql(
          graphqlOperation(updateMembertMutation, {
            input: { paymentHoliday: false, id: added },
          })
        );
      } catch (error) {
        console.error("Error updating payment holiday", error);
      }
    }

    setLeft(
      left
        .concat(right.filter((right) => rightChecked.includes(right.id)))
        .sort((a, b) => a.surname?.localeCompare(b.surname))
    );
    setRight(
      not(
        right,
        right.filter((right) => rightChecked.includes(right.id))
      )
    );
    setChecked(
      not(
        checked,
        right
          .filter((right) => rightChecked.includes(right.id))
          .map((item) => item.id)
      )
    );
  };

  const customList = (items) => (
    <Paper sx={{ width: '80vw', height: '30vh', overflow: "auto" }}>
      <List dense component="div" role="list">
        {items?.map((member) => {
          const labelId = `transfer-list-item-${member.id}-label`;

          return (
            <ListItem
              key={member.id}
              role="listitem"
              button
              onClick={handleToggle(member.id)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(member.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${member.forename} ${member.surname} (${member.username})`}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="left"
      spacing={0}
      marginY={1}
      paddingX={{
        xs: "10px",
        sm: "10px",
      }}
    >
      <Grid container spacing={0} justifyContent="left" alignItems="left">
        <Grid item>
          <Typography>Fee Paying List</Typography>

          {customList(left)}
        </Grid>
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <Button
              xs={2}
              sx={{ my: 0.5 }}
              variant="outlined"

              onClick={handleCheckedRight}
              disabled={leftChecked?.length === 0}
              aria-label="move selected right"
            >
              ⬇️
            </Button>
            <Button
              xs={2}
              sx={{ my: 0.5 }}
              variant="outlined"

              onClick={handleCheckedLeft}
              disabled={rightChecked?.length === 0}
              aria-label="move selected left"
            >
              ⬆️
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          <Typography>Payment Holiday List</Typography>
          {customList(right)}
        </Grid>
      </Grid>
    </Grid>
  );
}
