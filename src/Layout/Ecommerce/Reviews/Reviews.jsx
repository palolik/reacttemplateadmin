import '../../../styles/productview.css';
import { useState } from "react";

const Reviews = () => {
    const Reviews = [
        {
            name: "John Doe",
            date: "23rd Jan, 2024",
            rating: 4,
            feedback: "This is the review added by me. This is a very important thing for any website! das asd ewq qwe asd zxc rwe asf dsfa asd aewer sdf zfs",
            like: "123",
            status: "show",
            pid: "c123321",
            profilePic: "https://i.pravatar.cc/150?img=3",
        },
        {
            name: "Jane Smith",
            date: "20th Jan, 2024",
            rating: 5,
            feedback: "Absolutely loved this website! Everything is so easy to use.",
            like: "256",
            status: "show",
            pid: "c987654",
            profilePic: "https://i.pravatar.cc/150?img=4",
        },
        {
            name: "Mark Johnson",
            date: "18th Jan, 2024",
            rating: 3,
            feedback: "Good experience, but could be improved in certain areas.",
            like: "89",
            status: "show",
            pid: "c112233",
            profilePic: "https://i.pravatar.cc/150?img=5",
        },
    ];

    const ordersPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentReviews = Reviews.slice(startIndex, endIndex);

    const totalPages = Math.ceil(Reviews.length / ordersPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            <div className='headr'>All Reviews</div>
            <div className='headrr'>
                <div>
                    <button className="mr-2">Import</button>
                    <button>Export</button>
                </div>
                <div className='srch'>
                    <input type="text" placeholder="Search" />
                    <button>Search</button>
                </div>
            </div>

            <div className="tabst">
            <div>Pid</div>
                <div>Customer Name</div>
                <div>Date</div>
                <div>Rating</div>
                <div>Feedback</div>
                <div>Likes</div>
                <div>Status</div>
            </div>

            <div className="flex flex-col m-2">
                {currentReviews.map((review, index) => (
                    
                    <div key={index} className="tabc">
                              <div>{review.pid}</div>
                        <div>
                            <img src={review.profilePic} alt="Profile" className="h-10 w-10" />
                            <strong>{review.name}</strong>
                        </div>
                        <div>{review.date}</div>
                        <div>{review.rating} / 5</div>
                        <div>{review.feedback}</div>
                        <div>{review.like}</div>
                        <div>{review.status}</div>
                    </div>
                ))}
            </div>

            <div className="pag">
                <div>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>{currentPage}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
