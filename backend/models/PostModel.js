import { PrismaClient } from "@prisma/client";
import fs from 'fs/promises';
import sharp from 'sharp';
import "dotenv/config";

const prismadb = new PrismaClient(); //Move to external module

export class PostModel {

    static async create(post_data, post_file, user_id) {

        try {

            console.log(post_data);
            console.log(post_file);

            //Fetch category id by name provided in request
            const platform = await prismadb.platform.findFirst({
                where: {
                    platform_name: {
                        contains: post_data.platform,
                        mode: "insensitive"
                    }
                }
            })

            //Fetch genre id by name provided in request
            const genre = await prismadb.genre.findFirst({
                where: {
                    genre_name: {
                        contains: post_data.genre,
                        mode: "insensitive"
                    }
                }
            })

            console.log(platform, genre);



            //Mount image in public directory
            await sharp(post_file.path).toFile(`./public/static/images/${post_file.originalname}`);
            await fs.unlink(post_file.path);


            //Create post
            const newPost = await prismadb.post.create({
                data: {
                    post_title: post_data.title,
                    post_description: post_data.description,
                    post_condition: post_data.state.toLowerCase(),
                    user_id: user_id,
                    platform_id: platform.platform_id,
                    genre_id: genre.genre_id,
                    post_photos: [`${process.env.PHOTOS_URL}/${post_file.originalname}`],
                    post_price: post_data.price
                }
            })

            console.log(newPost);

            return 1;

        } catch (error) {
            console.log(error);
        }

    }

    static async getById(id) {
        try {
            const result = await prismadb.post.findFirst({
                where: {
                    post_id: +id
                },
                include: { //Adding the vendor information of this post - SPRINT 4
                    user_client: true
                }
            })
            console.log(result);

            return result
        } catch (err) {
            console.error(err)
        }
    }

    static async getImages(postImage) {
        try {
            console.log(postImage)
            await sharp(postImage.path).toFile(`./public/static/images/${postImage.originalname}`);
            await fs.unlink(postImage.path);
            return 1;
        } catch (error) {
            console.log(error);
        }
    }

    static async getCategories() {
        try {
            const categories = await prismadb.platform.findMany();
            //console.log(categories);

            //Count how many post are in each category.
            const conteoPostsPorPlataforma = await prismadb.post.groupBy({
                by: ['platform_id'],
                where: {
                    post_status: true,
                    post_buyed: false
                },
                _count: true,
            });

            console.log(conteoPostsPorPlataforma);

            const agrupacion = []

            conteoPostsPorPlataforma.forEach(counter => {
                const c2 = categories.find(category => counter.platform_id === category.platform_id);
                agrupacion.push({ platform_name: c2.platform_name, platform_count: counter._count, platform_id: c2.platform_id });
            })

            console.log(agrupacion);

            return [1, categories, agrupacion]
        }
        catch (error) {
            console.log(error);
        }
    }

    static async getPostsByCategory(category_id) {
        try {
            let posts = await prismadb.post.findMany({
                where: {
                    AND: [
                        { platform_id: category_id },
                        { post_status: true },
                        { post_buyed: false }
                    ]
                },
                include: {
                    genre: true,
                    user_client: true
                }
            });

            //We only get the posts that correspond to activated users in the system.
            posts = posts.filter(post => post.user_client.user_status);


            return posts;
        }
        catch (error) {
            console.log(error);
        }
    }

    static async getPostsByCategoryLogIn(category_id, userId) {
        try {
            let posts = await prismadb.post.findMany({
                where: {
                    AND: [
                        { platform_id: category_id },
                        { post_status: true },
                        { post_buyed: false }
                    ],
                    NOT: {
                        user_id: userId
                    }
                },
                include: {
                    genre: true,
                    user_client: true
                }
            });

            //We only get the posts that correspond to activated users in the system.
            posts = posts.filter(post => post.user_client.user_status);

            return posts;
        }
        catch (error) {
            console.log(error);
        }
    }


    static async getGenres() {
        try {
            const genres = await prismadb.genre.findMany();
            //console.log(categories);
            return [1, genres]
        }
        catch (error) {
            console.log(error);
        }
    }

    static async getPostsByUserId(req_user_id) {
        const posts = await prismadb.post.findMany({
            where: {
                AND: [
                    { user_id: req_user_id },
                    { post_status: true },
                    { post_buyed: false }
                ]
            }
        });

        return posts;
    };

    static async getPostsByQuery(query) {
        let posts = await prismadb.post.findMany({
            where: {
                AND: [
                    {
                        post_title: {
                            startsWith: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        post_status: true,
                        post_buyed: false
                    }
                ]
            },
            include:
            {
                platform: true,
                genre: true,
                user_client: true
            }
        });

        //We only get the posts that correspond to activated users in the system.
        posts = posts.filter(post => post.user_client.user_status);

        return posts;
    };

    static async getPostsByQueryLogIn(query, userId) {
        let posts = await prismadb.post.findMany({
            where: {
                AND: [
                    {
                        post_title: {
                            startsWith: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        post_status: true,
                        post_buyed: false
                    }
                ],
                NOT: {
                    user_id: userId
                }
            },
            include:
            {
                platform: true,
                genre: true,
                user_client: true
            }
        });

        //We only get the posts that correspond to activated users in the system.
        posts = posts.filter(post => post.user_client.user_status);

        return posts;
    };

    static async getVendorPosts(vendorId) {
        const posts = await prismadb.post.findMany({
            where: {
                AND: [
                    { user_id: vendorId },
                    { post_status: true },
                    { post_buyed: false }
                ]
            }
        });

        //Maybe we need to get the vendor information here?? /SPRINT 4

        return posts;
    }

    static async deletePost(postIdToDelete) {
        const post = await prismadb.post.update({
            where: {
                post_id: postIdToDelete
            },
            data: {
                post_status: false
            }
        });

        return [1, post];
    }

    static async updatePost(data, postIdToPatch, userId, post_file) {
        //Fetch category id by name provided in request
        const platform = await prismadb.platform.findFirst({
            where: {
                platform_name: {
                    contains: data.platform,
                    mode: "insensitive"
                }
            }
        });

        //Fetch genre id by name provided in request
        const genre = await prismadb.genre.findFirst({
            where: {
                genre_name: {
                    contains: data.genre,
                    mode: "insensitive"
                }
            }
        });

        //Mount image in public directory
        //public/static/images directory must be previously created!

        await sharp(post_file.path).toFile(`./public/static/images/${post_file.originalname}`);
        await fs.unlink(post_file.path);

        const updatedPost = await prismadb.post.update({
            where: {
                post_id: postIdToPatch
            },
            data: {
                post_title: data.title,
                post_description: data.description,
                post_price: Math.floor(Number(data.price)),
                post_condition: data.state.toLowerCase(),
                platform_id: platform.platform_id,
                genre_id: genre.genre_id,
                post_photos: [`${process.env.PHOTOS_URL}/${post_file.originalname}`]
            }
        });

        return [1, updatedPost];
    }

    static async getPurchases(userId) {
        const purchases = await prismadb.purchase.findMany({
            where: {
                user_buyer_id: userId
            },
            include: {
                post: {
                    include: {
                        user_client: true
                    }
                }

            }
        });

        return [1, purchases];
    }

    static async setReservation(userId, postId) {

        const post = await prismadb.post.findFirst({
            where: {
                post_id: postId
            }
        });

        const statusReserved = post.post_reserved ? false : true;

        const postReservation = await prismadb.post.update({
            where: {
                post_id: post.post_id
            },
            data: {
                post_reserved: statusReserved
            }
        })

        const newReservation = await prismadb.reservation.create({
            data: {
                user_reserver_id: userId,
                post_id: postReservation.post_id
            }
        })

        return [postReservation, newReservation];
    }

    static async getSells(userId) {
        const purchases = await prismadb.purchase.findMany({
            include: {
                post: {
                    include: {
                        platform: true
                    }
                },
                user: true
            }
        });

        const userSells = purchases.filter(purchase => purchase.post.user_id === userId);

        return [1, userSells];
    }

    static async getReservations(userId) {
        const reservations = await prismadb.reservation.findMany({
            where: {
                user_reserver_id: userId
            },
            include: {
                post: {
                    include: {
                        user_client: true
                    }
                }
            }
        });

        //We return the reservations that correspond to activated posts in the system.
        const reservationsOfActivatedPosts = reservations.filter(reservations => reservations.post.post_status);

        return [1, reservationsOfActivatedPosts];
    }

    static async deleteReservation(reservationIdToDelete) {
        const reservation = await prismadb.reservation.findFirst({
            where: {
                reservation_id: reservationIdToDelete
            },
            include: {
                post: true
            }
        });

        //Actualizar el estado de reserva del producto concreto.
        const post = await prismadb.post.update({
            where: {
                post_id: reservation.post_id
            },
            data: {
                post_reserved: false
            }
        })

        //Eliminar el la reserva de la tabla pertinente.
        const deletion = await prismadb.reservation.delete({
            where: {
                reservation_id: reservation.reservation_id
            }
        });

        return [1, deletion];
    }

    static async deactivatePost(postId) {
        const postDeactivated = await prismadb.post.update({
            where: {
                post_id: postId
            },
            data: {
                post_status: {
                    set: false
                }
            }
        });

        return 1;
    };

    static async createPurchase(userId, postId) {

        try {
            //We set this post as buyed and not reserved.
            const updatedStatus = await prismadb.post.update({
                where: {
                    post_id: postId
                },
                data: {
                    post_buyed: true,
                    post_reserved: false
                }
            });

            //We drop the reservation registry of this post in the reservation table.
            const dropStatus = await prismadb.reservation.deleteMany({
                where: {
                    post_id: postId
                }
            });

            //We add the purchase registry to the purchases table.
            const newPurchase = await prismadb.purchase.create({
                data: {
                    user_buyer_id: userId,
                    post_id: postId
                }
            })

            if (newPurchase === null) return -1;

            return 1;
        } catch (error) {
            throw new Error(error);
        }

    }
}