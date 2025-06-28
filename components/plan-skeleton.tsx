import { planSkeleton } from "./primitives";

export const PlanSkeleton = () => {
  const { wrapper, image, title, price, description, features, feature } =
    planSkeleton();

  return (
    <div className={wrapper()}>
      <div className={image()} />
      <div className={title()} />
      <div className={price()} />
      <div className={description()} />
      <div className={features()}>
        <div className={feature()} />
        <div className={feature()} />
        <div className={feature()} />
      </div>
    </div>
  );
};

export const PlanSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PlanSkeleton />
      <PlanSkeleton />
      <PlanSkeleton />
    </div>
  );
};
