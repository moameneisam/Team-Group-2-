function SkeletonLine({ width = '100%', height = '14px' }) {
  return <div className="skeleton-line" style={{ width, height }} />;
}

function SkeletonLoader() {
  return (
    <div className="roadmap-skeleton">
      <div className="glass-card p-4 mb-4">
        <SkeletonLine width="45%" height="28px" />
        <SkeletonLine width="80%" height="14px" />
        <SkeletonLine width="60%" height="14px" />
      </div>
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonLine key={i} width="110px" height="36px" />
        ))}
      </div>
      <div className="row g-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-md-4">
            <div className="glass-card p-4">
              <SkeletonLine width="70%" height="18px" />
              <SkeletonLine width="100%" height="12px" />
              <SkeletonLine width="90%" height="12px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonLoader;
