import * as React from "react";
import Grid from "@mui/material/Grid";
import { formatDistanceToNow } from "date-fns";
import {
  Fade,
  List,
  ListItem,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";

import { TransitionGroup } from "react-transition-group";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as subscriptions from "../../graphql/subscriptions";

const getZeroPaddedDate = () => {
  const date = new Date();

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  // Combine the parts and format the date

  const formattedDate = `${day}/${month}/${year}`;

  console.log(formattedDate);
  return formattedDate;
};

export const EventLog = () => {
  const [events, setEvents] = React.useState([]);
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    // Update time every minute
    const intervalId = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await API.graphql(
          graphqlOperation(
            queries.applicationEventLogsByDateStringAndCreatedAt,
            { dateString: getZeroPaddedDate(), sortDirection: "DESC" }
          )
        );
        const existingTasks =
          response.data.applicationEventLogsByDateStringAndCreatedAt.items;
        setEvents(existingTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchLogs();
  }, []);

  React.useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateApplicationEventLog, {
        dateString: getZeroPaddedDate,
      })
    ).subscribe({
      next: (response) => {
        const newTask = response.value.data.onCreateApplicationEventLog;
        setEvents((prevTasks) => [newTask, ...prevTasks]);
      },
      error: (error) => console.error(error),
    });

    return () => subscription.unsubscribe();
  }, []);

  const getRelativeTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <>
      <Grid
        container
        flexDirection="column"
        justifyContent="center"
        spacing={0}
        marginY={1}
        paddingX={0}
      >
        <div>
          <TransitionGroup component={List}>
            {events.slice().map((task, index) => (
              <Fade
                key={task.id}
                direction="up"
                in={true}
                // easing={20}
                appear={false}
                timeout={300}
              >
                <ListItem>
                  <ListItemText
                    primary={task.message}
                    secondary={getRelativeTime(task.createdAt)}
                  />
                </ListItem>
              </Fade>
            ))}
          </TransitionGroup>
        </div>
      </Grid>
    </>
  );
};
