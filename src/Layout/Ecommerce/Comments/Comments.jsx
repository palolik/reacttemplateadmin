import '../../../styles/productview.css';
import { useState } from "react";

const Comments = () => {
    const CommentData = [
        {
          pid: 1,
          cid: 1,
          rcid: null,
          name: "John Doe",
          date: "23rd Jan, 2024",
          mcmnt: "This is the review added by me. This is a very important thing for any website! das asd ewq qwe asd zxc rwe asf dsfa asd aewer sdf zfs",
          like: "123",
          status: "show",
          cn: "c123321",
          profilePic: "https://i.pravatar.cc/150?img=3",
        },
        {
          pid: 2,
          cid: 2,
          rcid: 1,
          name: "Jane Smith",
          date: "20th Jan, 2024",
          mcmnt: "Absolutely loved this website! Everything is so easy to use.",
          like: "256",
          status: "show",
          cn: "c987654",
          profilePic: "https://i.pravatar.cc/150?img=4",
        },
        {
          pid: 3,
          cid: 3,
          rcid: 1,
          name: "Mark Johnson",
          date: "18th Jan, 2024",
          mcmnt: "Good experience, but could be improved in certain areas.",
          like: "89",
          status: "show",
          cn: "c112233",
          profilePic: "https://i.pravatar.cc/150?img=5",
        },
        {
          pid: 4,
          cid: 4,
          rcid: null,
          name: "Mark Johnson",
          date: "18th Jan, 2024",
          mcmnt: "Good experience, but could be improved in certain areas.",
          like: "89",
          status: "show",
          cn: "c112233",
          profilePic: "https://i.pravatar.cc/150?img=5",
        },
    ];

    const ordersPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = CommentData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(CommentData.length / ordersPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            <div className='headr'>All Comments</div>
            <div className='headrr'>
                <div>
                    <button className="mr-2">Import</button>
                    <button >Export</button>
                </div>
                <div className='srch'>
                    <input type="text"  placeholder="Search" />
                    <button>Search</button> 
                </div>
            </div>
            <div className="tabst">
                <div>PID</div>
                <div>Comment ID</div>
                <div>Comment</div>
                <div>Reply to Comment ID</div>
                <div>Likes</div>
                <div>Status</div>
                <div>Actions</div>
            </div>

            <div className="flex flex-col m-2">
                {currentOrders.map((comment) => (
                    <div key={comment.cid} className="tabc">
                        <div>{comment.pid}</div>
                        <div>{comment.cid}</div>
                        <div>{comment.mcmnt}</div>
                        <div>{comment.rcid ? comment.rcid : '-'}</div>
                        <div>{comment.like}</div>
                        <div>{comment.status}</div>
                        <div className="pag">
                            <div>
                                <button>Hide</button>
                                <button>Delete</button>
                            </div>
                        </div>
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

export default Comments;
