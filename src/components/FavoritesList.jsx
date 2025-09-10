function FavoritesList({ favorites, loadFavorite, removeFavorite }) {
  return (
    <div className="Favorites-Body">
      <h2>Your Favorite Locations</h2>
      {favorites.length === 0 ? (
        <p className="No-Favorites">
          No favorite locations yet. Add some using the star button!
        </p>
      ) : (
        <div className="Favorites-List">
          {favorites.map((fav) => (
            <div key={`${fav.lat}-${fav.lng}`} className="Favorite-Item">
              <button
                className="Favorite-Info"
                onClick={() => loadFavorite(fav)}
              >
                <h3>{fav.name}</h3>
                <p>{fav.country}</p>
              </button>
              <button
                className="Remove-Favorite"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesList;
