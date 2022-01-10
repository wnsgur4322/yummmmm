class AuthService {

        logout = () => {
                localStorage.removeItem("client-token");
                localStorage.removeItem("loggedin-businessname");
                console.log("--[logout] client-token has cleaned:", localStorage.getItem("client-token"));
        };

        getCurrentUsertoken = () => {
                console.log("--client-token:", localStorage.getItem("client-token"));
                return localStorage.getItem("client-token");
        };

        getCurrentBusinessname = () => {
                console.log("--loggedin-businessname:", localStorage.getItem("loggedin-businessname"));
                return localStorage.getItem("loggedin-businessname");
        }

}
export default new AuthService();