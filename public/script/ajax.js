
/*

A J A X . J S

library file for common asynchronous requests to server


*/


class Ajax {
    static async GET(url) {
        try {
            const req = await fetch(url);
            return await req.json();
        } catch (e) {
            return {
                success: false,
                error: e
            };
        }
    }

    static async POST(url, obj) {
        try {
            const req = await fetch(url, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });

            const data = await req.json();

            return data;
        } catch (e) {
            return { 
                success: false,
                error: e 
            };
        }
    }

    static async running(limit, offset) {
        if (!offset && !limit) return await Ajax.GET(`${$dir}/api/running`);

        return await Ajax.POST(`${$dir}/api/runnig_with_options`,
            {
                offset: offset,
                limit: limit,
                sortBy: `datePublished`,
                sortOrder: `desc`
            }
        );
    }

    static async levenshtein(str) {
        if (!str.length) return;
        return await Ajax.GET(`${$dir}/api/levenshtein/${str}`);
    }

    static async schedule(movieID) {
        return await Ajax.POST(`${$dir}/api/schedule`, 
            {
                movieID: movieID
            }
        );
    }

    static async scheduleOptions(obj) {
        return await Ajax.POST(`${$dir}/api/schedule_with_options`, obj);
    }

    static async scheduleAll(obj) {
        return await Ajax.POST(`${$dir}/api/all_schedules_with_options`, obj);
    }

    static async actors(movieID) {
        return await Ajax.POST(`${$dir}/api/actors_in_movie`, 
            {
                movieID: movieID
            }
        );
    }
}

class User extends Ajax {
    static loginEvent = new Event(`login`);
    static logoutEvent = new Event(`logout`);

    static get isLoggedIn() {
        try {
            return JSON.parse(sessionStorage.user).loggedIn;
        } catch (e) {
            return false;
        }
    }

    static async login(username, password) {
        if (User.isLoggedIn) return {
            success: false,
            reason: `Already logged in`
        };

        const data = await Ajax.POST(`${$dir}/api/login`,
            {
                username: username,
                password: password
            }
        );

        if (data.success) {
            sessionStorage.setItem(`user`, JSON.stringify(
                {
                    loggedIn: true,
                }
            ));

            window.dispatchEvent(User.loginEvent);
        } else {
            data.reason = data.error;
        }

        return data;
    }

    static async logout() {
        sessionStorage.setItem(`user`, JSON.stringify(
            {
                loggedIn: false,
            }
        ));
        sessionStorage.clear(); 
        window.dispatchEvent(User.logoutEvent);
        return await Ajax.GET(`${$dir}/api/logout`);
    }

    static async createUser(obj) {
        const data = await Ajax.POST(`${$dir}/api/create_user`, obj);

        if (data.success) {
            await User.login(obj.username, obj.password);
        }

        return data;
    }

    static async userProfile() {
        return await Ajax.GET(`${$dir}/api/getprofile`);
    }

    static async updateProfile(obj) {
        return await Ajax.POST(`${$dir}/api/updateprofile`, obj);
    }

    static async getCart() {
        const data = await Ajax.GET(`${$dir}/api/get_cart`);
        if (data) {
            if (`msg` in data) {
                return {
                    success: false,
                    reason: `Login`
                }
            }
        }
        return data;
    }

    static async setCart(obj) {
        let data = await User.getCart();

        if (data.success === false) return data; // has to explicitly be false

        if (!data) {
            data = {};
            if (!data.items) data.items = [];
        }

        console.log(data);  

        data.items.push(obj);

        console.log(data);

        return await Ajax.POST(`${$dir}/api/set_cart`, data);
    }

    static async removeFromCart(index) {
        let data = await User.getCart();

        if (!data) return;

        data.items.splice(index, 1);

        await Ajax.POST(`${$dir}/api/set_cart`, data);
    }

    static async placeOrder(obj) {
        return await Ajax.POST(`${$dir}/api/placeorder`, obj);
    }

    static async getOrder() {
        let data = await Ajax.GET(`${$dir}/api/getorders`);
        
        data = data.map(item => {
            return Object.values(item)[0];
        });

        return data; 
    } 
}
