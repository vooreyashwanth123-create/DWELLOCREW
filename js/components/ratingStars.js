/**
 * DwelloCrew 2.0 — Dynamic Star Rating Renderer
 */

export function renderRatingStars(ratingAverage, showText = true, count = null) {
  const rounded = Math.round(ratingAverage * 10) / 10;
  const fullStars = Math.floor(rounded);
  const hasHalf = (rounded - fullStars) >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let starsHtml = '<div class="star-rating-inline">';
  for (let i = 0; i < fullStars; i++) starsHtml += '<span class="star star-full">★</span>';
  if (hasHalf) starsHtml += '<span class="star star-half">★</span>';
  for (let i = 0; i < emptyStars; i++) starsHtml += '<span class="star star-empty">☆</span>';

  if (showText) {
    starsHtml += `<span class="rating-number">${rounded.toFixed(1)}</span>`;
  }
  if (count !== null) {
    starsHtml += `<span class="rating-count">(${count})</span>`;
  }
  starsHtml += '</div>';

  return starsHtml;
}
