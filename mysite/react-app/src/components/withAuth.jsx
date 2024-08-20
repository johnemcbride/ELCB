import React, { useEffect, useState } from "react";
import { usePage } from '@inertiajs/react';
import { Auth } from "aws-amplify";
import { router } from '@inertiajs/react';
const withAuth = (WrappedComponent) => {
    return (props) => {
        const [groups, setGroups] = useState([]);
        const [session, setSession] = useState({});
        const [isLoaded, setIsLoaded] = useState(false);
        const { inertia } = usePage();

        useEffect(() => {
            const getSession = Auth.currentSession();
            const getUser = Auth.currentAuthenticatedUser();

            Promise.all([getSession, getUser])
                .then((values) => {
                    const session = values[0];
                    const user = values[1];
                    user.refreshSession(session.refreshToken, (err, session) => {
                        setSession(session);
                        setGroups(session.idToken.payload["cognito:groups"] || []);
                        setIsLoaded(true);
                    });
                })
                .catch((error) => {
                    console.log("Authentication issue:", error);
                    router.visit('/signin/');  // Redirect to sign-in page if not authenticated
                });
        }, [inertia]);

        if (!isLoaded) {
            return (<div>Loading...</div>);  // Loading state while authentication is in progress
        }

        return <WrappedComponent {...props} groups={groups} session={session} />;
    };
};

export default withAuth;
