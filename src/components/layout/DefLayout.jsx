import Navbar from "./Navbar"
import {Outlet, useNavigation} from "react-router";
import Loader from  "./Loader";
import LoadingBar from "./LoadingBar";

function DefLayout() {
    const navigation = useNavigation();
    const isNavigating = Boolean(navigation.location);

    return (  
        <div>
            <header>
                <Navbar />
                {isNavigating && <div className="absolute left-1/2 top-1/2 "><Loader /></div>}
                <LoadingBar isLoading={isNavigating} />
            </header>
                <Outlet />
        </div>
    );
}

export default DefLayout;