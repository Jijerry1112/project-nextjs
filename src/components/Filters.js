import styles from "./filter.module.css";

const Filters = ({titles, title, search}) => {
    return (
        <form className={styles.filterContainer} method="GET" action="/">
            <div className={styles.filterDropdown}>
                <label htmlFor="title">Select a title</label>
                <select id="title" name="title" defaultValue={title}>
                    <option value="">All</option>
                    {
                        titles.map(title => <option key={title} value={title}>{title}</option>)
                    }
                </select>
            </div>
            <div className={styles.filterSearch}>
                <label htmlFor="search">Search a name</label>
                <input id="search" name="search" defaultValue={search}/>
            </div>
            <button type="submit">Apply</button>
            <a className={styles.button} href="/">
                Clear
            </a>
        </form>
    )

}
export default Filters;