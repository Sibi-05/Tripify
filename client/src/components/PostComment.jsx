import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';

const PostComment = ({ comment, onDeleteComment }) => {
  
  const userId = useSelector((state) => state?.user?.currentUser?.id);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      
      await onDeleteComment(comment?._id);
    }
  };
  const commentCreatorId = comment.creator._id;
  const commentCreatorName = comment?.creator?.fullname;
  const commentCreatorImg = comment?.creator?.profileImg;

  return (
    <div className="flex items-start justify-between gap-3 p-3 bg-white rounded-xl border border-slate-100/80 transition-all hover:border-slate-200">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
          {commentCreatorImg ? (
            <Link to={`/users/${commentCreatorId}`}>
            <img 
              src={commentCreatorImg} 
              alt={commentCreatorName} 
              className="w-full h-full object-cover"
            />
            </Link>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-xs font-bold text-slate-500">
              {commentCreatorName?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h5 className="text-xs font-semibold text-slate-800 truncate">
              {commentCreatorName}
            </h5>
            <small className="text-[10px] text-slate-400">
              <TimeAgo date={comment?.createdAt} />
            </small>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap break-words">
            {comment?.comment}
          </p>
        </div>
      </div>


      {userId && String(userId) === String(commentCreatorId) && (
        <button 
          onClick={handleDelete}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 flex-shrink-0"
          title="Delete comment"
        >
          <FaRegTrashAlt className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default PostComment;