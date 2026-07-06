import React from "react";

const FeedSkeleton = () => {
  return (
    <section className="feedSkeleton">
      {[1, 2, 3].map((item) => (
        <article className="feedSkeleton_item" key={item}>
          <header className="feedSkeleton_item-head">
            <div></div>
          </header>

          <div className="feedSkeleton_item-body"></div>

          <footer className="feedSkeleton_item-footer">
            <span></span>
            <span></span>
            <span></span>
          </footer>
        </article>
      ))}
    </section>
  );
};

export default FeedSkeleton;