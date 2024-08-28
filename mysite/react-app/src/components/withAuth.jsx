import React, { useEffect, useState } from "react";
import { usePage } from '@inertiajs/react';

import { router } from '@inertiajs/react';


const withAuth = (WrappedComponent) => {
    return (props) => {


        if (props.user === null) {
            console.log('User null')
            router.visit("/signin");
        }
        else {
            return <WrappedComponent {...props} />
        }
    };
};

export default withAuth;
